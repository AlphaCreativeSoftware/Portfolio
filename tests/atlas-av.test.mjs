import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizeSnapshot } from '../src/features/tools/atlas-av/sources.ts'
import { supplementWithStationBoards } from '../src/features/tools/atlas-av/stationBoards.ts'
import { matchesSearch, summarize, staleAfter } from '../src/features/tools/atlas-av/model.ts'

const now = Date.parse('2026-11-18T18:39:30Z')
const madrid = { code: 60000, name: 'Madrid Atocha' }
const barcelona = { code: 71801, name: 'Barcelona Sants' }
const valencia = { code: '03216', name: 'València Joaquín Sorolla' }
const sevilla = { code: 51003, name: 'Sevilla Santa Justa' }
const base = { company: 'Renfe', id: '03111', product: 'AVE', group: 'ave', origin: madrid, dest: barcelona, live: true, estimated: false, scheduled: false, lat: 41.4, lon: 1.9, delay: 0, delaySource: 'renfe' }
const feed = (...trains) => ({ generatedAt: new Date(now).toISOString(), trains, attribution: 'Fixture' })
const vehicle = (id = '03111', lon = 2.01, timestamp = now) => ({ vehicle: { vehicle: { label: id }, timestamp: timestamp / 1000, position: { latitude: 41.2, longitude: lon } } })
const gps = (...entity) => ({ header: { timestamp: String(now / 1000) }, entity })

test('filters both directions by terminals and does not infer corridors from GPS or the next stop', () => {
  const data = normalizeSnapshot(feed(
    base,
    { ...base, id: '02', origin: valencia, dest: madrid },
    { ...base, id: '03', dest: sevilla },
    { ...base, id: '04', origin: barcelona, dest: sevilla, next: madrid },
    { ...base, id: '05', dest: { name: 'Málaga María Zambrano' }, next: sevilla },
    { ...base, id: '06', product: 'Cercanías', group: 'cercanias' },
  ), gps(vehicle()), now)
  assert.deepEqual(data.trains.map((train) => train.corridor), ['barcelona', 'valencia', 'sevilla'])
  assert.equal(data.trains[0].position.kind, 'gps')
  assert.equal(data.trains[0].position.lon, 2.01)
  assert.equal(data.trains[1].position, null)
  assert.equal(matchesSearch(data.trains[1], 'valencia'), true)
})

test('preserves officially sourced delays without treating timetables or predictions as measurements', () => {
  const data = normalizeSnapshot(feed(
    base,
    { ...base, company: 'OUIGO', product: 'Ouigo', id: 'TGV 10001', dest: sevilla, live: false, estimated: true, scheduled: true, delay: null, delaySource: null },
    { ...base, company: 'iryo', product: 'iryo', id: '06105', dest: valencia, live: false, estimated: true, delay: 8, delaySource: 'adif' },
    { ...base, id: '03112', delay: null, shownDelay: 0, projectedDelay: 0 },
    { ...base, id: '03113', advisory: { kind: 'canceled' } },
  ), gps(vehicle(), vehicle('03112')), now)
  assert.deepEqual(data.trains.map((train) => [train.position?.kind ?? null, train.delay, train.status]), [
    ['gps', 0, 'tracked'], [null, null, 'scheduled'], ['estimated', 8, 'tracked'], ['gps', null, 'tracked'], [null, null, 'cancelled'],
  ])
  assert.deepEqual(summarize(data.trains), { gps: 2, estimated: 1, measured: 2, punctuality: 50 })
})

test('stale or ambiguous GPS does not produce a marker and duplicate services collapse', () => {
  const stale = normalizeSnapshot(feed(base, base), gps(vehicle('03111', 2.01, now - staleAfter - 1000)), now)
  assert.equal(stale.trains.length, 1)
  assert.equal(stale.trains[0].position, null)
  const ambiguous = normalizeSnapshot(feed(base), gps(vehicle(), vehicle('3111', -.91)), now)
  assert.equal(ambiguous.trains[0].position, null)
  assert.throws(() => normalizeSnapshot({ trains: [] }, null, now))
})

test('keeps the backup GPS reading distinct from direct coordinates and direct timestamp', () => {
  const data = normalizeSnapshot(feed(base), { ...gps(vehicle()), header: { timestamp: (now - 180_000) / 1000 } }, now, gps(vehicle()))
  assert.equal(data.trains[0].position.source, 'Trenalia')
  assert.equal(data.trains[0].position.timestampKind, 'feed')
  assert.equal(normalizeSnapshot(feed(base), gps(vehicle()), now, gps(vehicle())).trains[0].position.source, 'Renfe')
})

const ouigo = { company: 'OUIGO', product: 'Ouigo', group: 'ouigo', id: 'TGV 6570', origin: barcelona, dest: madrid, scheduled: true }
const board = (station, rows = {}, { at = now, code = station.code } = {}) => ({
  code: String(code).padStart(5, '0'),
  data: { generatedAt: new Date(at).toISOString(), station, attribution: 'Panel de estación', ...rows },
})

test('merges OUIGO aliases across both station boards without promoting timetables to live data', () => {
  const snapshot = normalizeSnapshot(feed(ouigo), null, now)
  const merged = supplementWithStationBoards(snapshot, [
    board(madrid, { arrivals: [{ ...ouigo, id: '06570', kind: 'arrival', scheduledTime: '20:42', estimatedTime: '20:42', status: 'on_the_way', estimated: true, position: { lat: 41, lon: 0 } }] }),
    board(barcelona, { departures: [{ ...ouigo, kind: 'departure', scheduledTime: '18:15', destScheduled: '20:40', destTime: '21:13' }] }),
  ], now)
  assert.equal(merged.trains.length, 1)
  const [train] = merged.trains
  assert.equal(train.key, snapshot.trains[0].key)
  assert.equal(train.status, 'scheduled')
  assert.equal(train.position, null)
  assert.equal(train.delay, null)
  assert.equal(train.stationTimes.departure, '18:15')
  assert.equal(train.stationTimes.arrival, '20:42')
  assert.equal(train.stationTimes.expected, undefined)
  assert.equal(merged.attribution, 'Fixture · Panel de estación')
})

test('adds iryo with a corroborated Adif arrival, without inferring GPS or inventing a position', () => {
  const arr = { ...ouigo, company: 'ILSA', product: 'iryo', id: '06180', origin: madrid, dest: { ...valencia, code: 3216 }, kind: 'arrival', scheduled: false, scheduledTime: '20:22', estimatedTime: '20:48', status: 'on_the_way', delaySource: 'adif', delay: 26, estimated: true }
  const snapshot = normalizeSnapshot(feed(), null, now)
  const [train] = supplementWithStationBoards(snapshot, [board(valencia, { arrivals: [arr] })], now).trains
  assert.equal(train.operator, 'iryo')
  assert.equal(train.status, 'tracked')
  assert.equal(train.delay, 26)
  assert.equal(train.position, null)
  assert.deepEqual(train.stationTimes.expected, { time: '20:48', source: 'Adif', reportedAt: now })
  const [estimated] = supplementWithStationBoards(snapshot, [board(valencia, { arrivals: [{ ...arr, position: { lat: 39.8, lon: -1.2 } }] })], now).trains
  assert.equal(estimated.position.kind, 'estimated')
  assert.deepEqual(summarize([estimated]), { gps: 0, estimated: 1, measured: 1, punctuality: 0 })
})

test('ignores missing, stale, past and intermediate station-board readings', () => {
  const arrival = { ...ouigo, kind: 'arrival', scheduledTime: '20:42', minutes: 42 }
  const snapshot = normalizeSnapshot(feed(base), gps(vehicle()), now)
  const merged = supplementWithStationBoards(snapshot, [
    { code: '60000', data: null },
    board(madrid, { arrivals: [arrival] }, { at: now - staleAfter - 1 }),
    board(madrid, { arrivals: [arrival] }, { code: valencia.code }),
    board(madrid, { arrivals: [{ ...arrival, minutes: -1 }] }),
    board(sevilla, { arrivals: [arrival] }),
  ], now)
  assert.deepEqual(merged, snapshot)
})

test('a bare board timetable preserves a measured delay and cannot revive a cancellation', () => {
  const arrival = { ...ouigo, kind: 'arrival', scheduledTime: '20:42' }
  const snapshot = normalizeSnapshot(feed({ ...ouigo, scheduled: false, delay: 5, delaySource: 'adif' }, { ...ouigo, id: 'TGV 6571', cancelled: true }), null, now)
  const { trains } = supplementWithStationBoards(snapshot, [board(madrid, { arrivals: [arrival, { ...arrival, id: '06571' }] })], now)
  assert.deepEqual(trains.map(({ status, delay, position }) => [status, delay, position]), [['tracked', 5, null], ['cancelled', null, null]])
})
