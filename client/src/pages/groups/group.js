import React from "react";
import {Tab} from 'semantic-ui-react';

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: ''
        }

        this.menuClickHandler = this.menuClickHandler.bind(this);
    }

    render() {

        return (

            <div className="ui segment">
                <h1>Group: {this.state.id}</h1>
                <GroupTabs />
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

    menuClickHandler(e) {
        // const active = document.getElementsByClassName("item active");
        // active[0].className = "item";
        // console.log(active);
        // e.;
    }
}

const panes = [
    {
        menuItem:
            {key: 'notes', icon: 'sticky note', content: 'Все записи'},
            render: () => <Tab.Pane attached={false}>Все записи</Tab.Pane>
    },
    {
        menuItem:
            {key: 'favorites', icon: 'star', content: 'Важные'},
            render: () => <Tab.Pane attached={false}>Важные</Tab.Pane>
    },
    {
        menuItem:
            {key: 'users', icon: 'users', content: 'Пользователи'},
            render: () => <Tab.Pane attached={false}>Пользователи</Tab.Pane>
    },
];

const GroupTabs = () => (
    <Tab menu={{secondary: true, pointing: true}} panes={panes} />
);
// $(function(){
//     $('a.item').click( function(){
//         $('.item').removeClass('active');
//         $(this).addClass('active');
//     })
// });

export default Group;

