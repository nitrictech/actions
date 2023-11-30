// /**
//  * Unit tests for the action's main functionality, src/main.ts
//  *
//  * These should be run as if the action was called from a workflow.
//  * Specifically, the inputs listed in `action.yml` should be set as environment
//  * variables following the pattern `INPUT_<INPUT_NAME>`.
//  */

import * as core from '@actions/core'
import * as main from '../src/main'
import {
  beforeEach,
  expect,
  test,
  describe,
  vitest,
  type SpyInstance
} from 'vitest'

// Mock the action's main function
const runMock = vitest.spyOn(main, 'run')

// Other utilities
const timeRegex = /^\d{2}:\d{2}:\d{2}/

// Mock the GitHub Actions core library
let debugMock: SpyInstance
let errorMock: SpyInstance
let getInputMock: SpyInstance
let setFailedMock: SpyInstance
let setOutputMock: SpyInstance

describe('action', () => {
  beforeEach(() => {
    vitest.clearAllMocks()

    debugMock = vitest.spyOn(core, 'debug')
    errorMock = vitest.spyOn(core, 'error')
    getInputMock = vitest.spyOn(core, 'getInput')
    setFailedMock = vitest.spyOn(core, 'setFailed')
    setOutputMock = vitest.spyOn(core, 'setOutput')
  })

  test('sets the version output', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'version':
          return '1.33.3'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, 'Waiting 500 milliseconds ...')
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(timeRegex)
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(timeRegex)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'time',
      expect.stringMatching(timeRegex)
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  test('sets a failed status', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'version':
          return 'this is not a semantic version'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(1, 'test')
    expect(errorMock).not.toHaveBeenCalled()
  })
})
