import { z } from 'zod';

export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    LIVE: 'live',
    FINISHED: 'finished',
};

export const listMatchesQuerySchema = z.object({
    limit: z
        .coerce.number()
        .int({ message: 'limit must be an integer' })
        .positive({ message: 'limit must be a positive number' })
        .max(100, { message: 'limit must be at most 100' })
        .optional(),
});

export const matchIdParamSchema = z.object({
    id: z
        .coerce.number()
        .int({ message: 'id must be an integer' })
        .positive({ message: 'id must be a positive number' }),
});

const isoDateString = z.string().datetime({
    message: 'Must be a valid ISO date string'
});

export const createMatchSchema = z
    .object({
        sport: z.string().min(1, { message: 'sport is required' }),
        homeTeam: z.string().min(1, { message: 'homeTeam is required' }),
        awayTeam: z.string().min(1, { message: 'awayTeam is required' }),
        startTime: isoDateString,
        endTime: isoDateString,
        homeScore: z
            .coerce.number()
            .int({ message: 'homeScore must be an integer' })
            .nonnegative({ message: 'homeScore must be non-negative' })
            .optional(),
        awayScore: z
            .coerce.number()
            .int({ message: 'awayScore must be an integer' })
            .nonnegative({ message: 'awayScore must be non-negative' })
            .optional(),
    })
    .superRefine((data, ctx) => {
        const start = Date.parse(data.startTime);
        const end = Date.parse(data.endTime);

        if (Number.isNaN(start) || Number.isNaN(end)) {
            return;
        }

        if (end <= start) {
            ctx.addIssue({
                path: ['endTime'],
                code: z.ZodIssueCode.custom,
                message: 'endTime must be after startTime',
            });
        }
    });

export const updateScoreSchema = z.object({
    homeScore: z
        .coerce.number()
        .int({ message: 'homeScore must be an integer' })
        .nonnegative({ message: 'homeScore must be non-negative' }),
    awayScore: z
        .coerce.number()
        .int({ message: 'awayScore must be an integer' })
        .nonnegative({ message: 'awayScore must be non-negative' }),
});
