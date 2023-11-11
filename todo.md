## TODO

- Bill Status bar
  - Delete bill
  - Edit bill
  - Value ratings ($$$)
  - Add commenting on bills

- bill tags
  - custom tags per group that can be applied to individual bills. Things like 'rent', 'food', etc. would be useful

- follow feature
  - two users who follow each other are considered "friends"

- create `ToastProvider` with `useToast => popToast` to pop a toast box from anywhere in the app

- provider agnostic payment implementation
  - Define set of fields that all payment processors should adhere to
  - Use Adapter pattern to create modules for each processor we have that `impl` the functions we expect, then use those functions in our code, not the processor itself
## Larger overhaul - Communities for Real Life
- Reimagine bills as "stories" that essentially tell a sequential story about an event from start to finish.
- This intuitively allows for more interesting features like commenting and adding pictures to "stories"
  - imagine a story is a dinner party, you can basically start the story before days in advance, even comment on it, then it happens, and you add all of the totals, and pictures to the story.
    - everyone added to the story can add pictures of the story throughout. Imagine everyone takes a picture of their plate and adds it to the story in the app. Tag each photo with who uploaded it

## Payments
- `account/payments/link`
