import 'mocha'
import assert from 'assert'
import axiosist from 'axiosist'
import wrapper, { Request, Response } from '.'

it('should works', async () => {
  const handler = async (request: Request) => new Response(await request.text(), {
    statusText: request.url
  })
  const response = await axiosist(wrapper(handler)).post('/foo', 'bar')
  assert.strictEqual(response.statusText, '/foo')
  assert.strictEqual(response.data, 'bar')
})
