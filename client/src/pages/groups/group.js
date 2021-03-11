import React from "react";

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: ''
        }
    }

    render() {

        return (
            <div>
                <h1>Group: {this.state.id}</h1>
            </div>
        )
    }

    componentDidMount() {
        this.setState({id: this.props.match.params.id});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            this.setState({id: this.props.match.params.id});
        }
    }

}

export default Group;

