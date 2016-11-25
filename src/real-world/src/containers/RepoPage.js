import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {loadRepo, loadStargazers} from '../actions'
import Repo from '../components/Repo'
import List from '../components/List'
import User from '../components/User'

const loadData = props => {
    const {fullName} = props
    loadRepo(fullName, ['description'])
    loadStargazers(fullName)
}

class RepoPage extends Component {
    static propTypes = {
        repo: PropTypes.object,
        fullName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        owner: PropTypes.object,
        stargazers: PropTypes.array.isRequired,
        stargazersPagination: PropTypes.object,
        loadRepo: PropTypes.func.isRequired,
        loadStargazers: PropTypes.func.isRequired
    }
    componentWillMount() {
        loadData(this.props)
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.fullName !== nextProps.fullName) {
            loadData(nextProps)
        }
    }
    handleLoadMoreClick() {
        this.props.loadStargazers(this.props.fullName, true)
    }
    renderUser(user){
        return <User user={user} key={user.login}/>
    }
    render() {
        const {repo, owner, name} = this.props
        if(!repo || !name) {
            return <h1><i>Loading {name} details...</i></h1>
        }

        const {stargazers, stargazersPagination} = this.props
        return (
            <div>
                <Repo repo={repo} owner={owner}/>
                <hr/>
                <List renderItem={this.renderUser}
                    items={stargazers}
                    onLoadMoreClick={this.handleLoadMoreClick}
                    loadingLabel={`Loading stargazers of ${name}...`}
                    {...stargazersPagination}
                    />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const login = ownProps.params.login.toLowerCase()
    const name = ownProps.params.name.toLowerCase()
    
    const {
        pagination: {stargazersByRepo},
        entities: {users, repos}
    } = state

    const fullName = `${login}/${name}`
    const stargazersPagination = stargazersByRepo[fullName] || {ids:[]}
    const stargazers = stargazersPagination.ids.map(id => users[id])

    return {
        fullName,
        name,
        stargazers,
        stargazersPagination,
        repo: repos[fullName],
        owner: users[login]
    }
}

export default connect(mapStateToProps, {
    loadRepo,
    loadStargazers
})(RepoPage)