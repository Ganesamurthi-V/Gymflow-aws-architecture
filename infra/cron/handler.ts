// EventBridge -> this Lambda -> POST to the app's own cron route. Kept outside the Next
// bundle so a cron tick never competes with page traffic for the server Lambda's concurrency.
export async function handler(): Promise<void> {
  const { APP_URL, CRON_PATH, CRON_SECRET } = process.env
  const res = await fetch(`${APP_URL}${CRON_PATH}`, {
    method: 'POST',
    headers: { 'x-cron-secret': CRON_SECRET ?? '' },
  })
  // Throwing makes the invocation count as an Error, so the failure is visible in CloudWatch.
  if (!res.ok) throw new Error(`${CRON_PATH} responded ${res.status}`)
}
