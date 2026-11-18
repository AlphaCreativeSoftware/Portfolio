import { atlasResponse } from '../src/features/tools/atlas-av/apiResponse.ts'

export default { fetch: (request: Request) => atlasResponse(request.method) }
