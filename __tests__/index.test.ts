import { run } from '../index'
import * as process from 'process'
import * as core from '@actions/core'
import * as github from '@actions/github'

describe.each`
  ref | tagsFormatRegex | tagsBranchMap | expectedBranch
  ${'refs/tags/bv.2022-09-08.dev.01'}   | ${'(?<=[0-9]+\.)[a-zA-Z]+(?=\.*[0-9]+)'} | ${'develop=dev,devdeploy;testing=test'} | ${'develop'}
  ${'refs/tags/bv.2022-09-08.test.01'}  | ${'(?<=[0-9]+\.)[a-zA-Z]+(?=\.*[0-9]+)'} | ${'develop=dev,devdeploy;testing=test'} | ${'testing'}
  ${'refs/heads/develop'}               | ${'(?<=[0-9]+\.)[a-zA-Z]+(?=\.*[0-9]+)'} | ${'develop=dev,devdeploy;testing=test'} | ${'develop'}
  ${'refs/heads/testing'}           zz3    | ${''} | ${''} | ${'testing'}
`('stable version', ({ ref, tagsFormatRegex, tagsBranchMap, expectedBranch }) => {
    test(`${ref}`, async () => {
        process.env['INPUT_TAGS_FORMAT_REGEX'] = tagsFormatRegex
        process.env['INPUT_Tags_Branch_Map'] = tagsBranchMap
        github.context.ref = ref

        const spy = jest.spyOn(core, 'setOutput')
        await run()

        expect(spy).toHaveBeenCalledWith('branch_name', expectedBranch);
    })
})


describe.each`
  ref | tagsFormatRegex | tagsBranchMap | expectedBranch
  ${'refs/tags/bv.2022-09-08.demo.01'}  | ${'(?<=[0-9]+\.)[a-zA-Z]+(?=\.*[0-9]+)'} | ${'develop=dev,devdeploy;testing=test'} | ${''}
`('stable version', ({ ref, tagsFormatRegex, tagsBranchMap, expectedBranch }) => {
    test(`${ref}`, async () => {
        process.env['INPUT_TAGS_FORMAT_REGEX'] = tagsFormatRegex
        process.env['INPUT_Tags_Branch_Map'] = tagsBranchMap
        github.context.ref = ref

        const spy = jest.spyOn(core, 'setFailed')
        await run()

        expect(spy).toHaveBeenCalledTimes(1);
    })
})
