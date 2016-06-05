
import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { asyncConnect } from 'redux-connect'

import { profileLoaded } from './actions'
import VotesCount from './votes-count-component'


export const Profile = ({ user, profile }) => {

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
    </div>
  )
}


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

const mapState = ({ user, profile }, props) => ({
  ...props,
  user,
  profile
})

export default asyncConnect(asyncState)(connect(mapState)(Profile))
