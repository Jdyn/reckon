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

- Features for total completion of bill creation
  - option to make bill recurring on a time period
  - complete creating bill items
  - The ability to set who is "footing" the bill
    - who is the one paying irl? It doesn't have to be the creator of the bill.
  - ability to create bill "request orders"
    - I want to be able to create a request order, but anyone in the bill can fulfill it any time, and they will get reimbursed once everyone accepts that they fulfilled it.
    - it is basically a record of notice that we need something in the house, and that anyone can fulfill it out of convenience
  - total split and individual split types
    - new philosophy behind this may be that more is less. dont want to provide confusing buttons and triggers that may potentially make defining the split faster.

- provider agnostic payment implementation
  - Define set of fields that all payment processors should adhere to
  - Use Adapter pattern to create modules for each processor we have that `impl` the functions we expect, then use those functions in our code, not the processor itself
## Larger overhaul - Communities for Real Life
- Reimagine bills as "stories" that essentially tell a sequential story about an event from start to finish.
- This intuitively allows for more interesting features like commenting and adding pictures to "stories"
  - imagine a story is a dinner party, you can basically start the story before days in advance, even comment on it, then it happens, and you add all of the totals, and pictures to the story.
    - everyone added to the story can add pictures of the story throughout. Imagine everyone takes a picture of their plate and adds it to the story in the app. Tag each photo with who uploaded it

- Creating a bill overhaul
  - choose what to share
    - share an expense
    - share an interest
    - share an experience
