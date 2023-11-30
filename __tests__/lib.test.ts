import { expect, test } from 'vitest'
import { getDownloadUrl } from '../src/lib/get-download-url'

test('gets download url to binary', async () => {
  const url = await getDownloadUrl('1.33.3')

  expect(url).to.equal(
    'https://github.com/nitrictech/cli/releases/download/v1.33.3/nitric_1.33.3_Linux_x86_64.tar.gz'
  )
})
