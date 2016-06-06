
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'

import { profileLoaded } from './actions'
import VotesCount from './votes-count-component'


export const Profile = ({ user, profile, pollForm }) => {

  const { id: userId } = user
  const { id: profileId, username, polls } = profile

  return (
    <div>
      <h4>
        { userId === profileId
          ? 'My Polls'
          : `Asked by ${username}` }
      </h4>
      <hr/>
      <ul className='plain-list'>
        { polls.map(({ id, question, slug, votes }) =>
            <li key={ id }>
              <Link to={ `/poll/${username}/${slug}` }>
                <span>{ question } <VotesCount count={ votes }/></span>
              </Link>
            </li>
          ) }
      </ul>
      { userId === profileId
          ? <AddPoll username={ username }/>
          : null }
    </div>
  )
}


const AddPoll = ({ username }) =>

  <Link to='/create-poll'>
    <button className='btn btn-primary form-control'>Add Poll</button>
  </Link>


const onProfileLoaded = dispatch => profile => {

  dispatch(profileLoaded(profile))

  return profile
}


const asyncState = [
  {
    key: 'profile',
    promise: ({ helpers, params, store }) => {

      const { fetch } = helpers
      const { dispatch } = store
      const { username } = params

      return fetch(`/api/user/${username}`)
        .then(res => res.json())
        .then(onProfileLoaded(dispatch))
    }
  }
]

const mapState = ({ user, profile, pollForm }, props) => ({
  ...props,
  user,
  profile,
  pollForm
})

export default asyncConnect(asyncState)(connect(mapState)(Profile))
