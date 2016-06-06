
import App from './app-component'
import Poll from './poll-component'
import { Login, SignUp } from './credentials-component'
import Profile from './profile-component'
import PollsList from './polls-list-component'
import { NewPoll, EditPoll } from './poll-form-component'


export default [
  {
    path: '/',
    component: App,
    indexRoute: { component: PollsList },
    childRoutes: [
      { path: 'user/:username', component: Profile },
      { path: 'create-poll', component: NewPoll },
      { path: 'edit-poll/:pollId', component: EditPoll },
      { path: 'poll/:username/:slug', component: Poll },
      { path: 'login', component: Login },
      { path: 'signup', component: SignUp }
    ]
  }
]
