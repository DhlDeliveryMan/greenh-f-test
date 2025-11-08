import { z } from 'zod'

export const settingsIpcSchema = {
  'update-settings': {
    args: z.tuple([z.object({}).loose()]),
    return: z.void(),
  },
  'read-settings': {
    args: z.tuple([z.undefined()]), // no args
    return: z.object({}).loose(),
  },
}
