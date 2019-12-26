# Standard Request Handler

Pure standard `Request => Response` wrapper for Node.js

## Usage

```typescript
import { createServer } from 'http'

import wrap, { Request, Response } from 'standard-request-handler'

const standardHandler = // Here coms a `Request => Response` handler
  (request: Request) => new Response(`You are visiting ${request.url}`)

const server = createServer(wrap(standardHandler))
server.listen(process.env.PORT, process.env.HOST)
```

## License

Unlicense
