import cache from "../../db/caching";

export const getSlackProfilePhotoBySlackId = cache(async (slackId: string) => {
    const res = await fetch('https://slack.com/api/users.profile.get?user=' + slackId, {
        headers: {
            authorization: 'Bearer ' + process.env.SLACK_BOT_OAUTH_TOKEN
        }
    });

    return (await res.json()).profile?.image_512 ?? '';
});