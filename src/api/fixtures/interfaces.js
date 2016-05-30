
import tracery from 'tracery'


export const PollListItem = {
  id: Number,
  slug: String,
  votes: Number,
  userId: Number,
  username: String,
  question: String
}

export const Profile = {
  id: Number,
  username: String,
  polls: [tracery(PollListItem)]
}

export const Poll = {
  id: Number,
  slug: String,
  votes: Number,
  userId: Number,
  username: String,
  question: String,
  options: [tracery(Option)]
}

export const Auth = {
  id: Number,
  token: String,
  username: String
}

export const Vote = {
  id: Number,
  date: String,
  pollId: Number,
  optionId: Number
}

export const Option = {
  id: Number,
  value: String,
  votes: Number,
  pollId: Number
}
