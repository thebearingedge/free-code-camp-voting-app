
import App from './app-component'
import Login from './login-component'
import PollsList from './polls-list-component'
import Poll from './poll-component'


export default [
  {
    path: '/',
    component: App,
    indexRoute: { component: PollsList },
    childRoutes: [
      {
        path: ':username/:slug',
        component: Poll
      }
    ]
  },
  { path: '/login', component: Login }
]
