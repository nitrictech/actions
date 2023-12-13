// /**
//  * Unit tests for the action's main functionality, src/main.ts
//  *
//  * These should be run as if the action was called from a workflow.
//  * Specifically, the inputs listed in `action.yml` should be set as environment
//  * variables following the pattern `INPUT_<INPUT_NAME>`.
//  */

import core from '@actions/core'
import os from 'os'
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

const platformMock = vitest.spyOn(os, 'platform')

// Mock the GitHub Actions core library
// let debugMock: SpyInstance
let errorMock: SpyInstance
let getInputMock: SpyInstance
let setFailedMock: SpyInstance
// let setOutputMock: SpyInstance

describe('action', () => {
  beforeEach(() => {
    vitest.clearAllMocks()

    //debugMock = vitest.spyOn(core, 'debug')
    errorMock = vitest.spyOn(core, 'error')
    getInputMock = vitest.spyOn(core, 'getInput')
    setFailedMock = vitest.spyOn(core, 'setFailed')
    //setOutputMock = vitest.spyOn(core, 'setOutput')
  })

  test(`should fail on unsupported os`, async () => {
    platformMock.mockReturnValueOnce('win32')
    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Unsupported operating system. Needs to run on linux'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })

  test('should check invalid versions', async () => {
    platformMock.mockReturnValueOnce('linux')
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
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      'Incorrect version - Use semantic versioning E.g. 1.2.1'
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})
