import React, { Component, Fragment } from 'react';
import {Link, useRouteMatch, withRouter} from "react-router-dom";


class GroupsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebar : '',
            visible : true
        }
        this.toGroup=this.toGroup.bind(this);
    }
    toGroup(id) {
        this.props.history.push('/groups/'+id)
    }
    render() {
        const listGroups = this.props.myGroups.map((group) =>
            <div className="ui blue link card" key={group.id} onClick={() => this.toGroup(group.id)}>
                <div className="content">
                    <div className="header">{group.name} </div>
                    <div className="meta">Тут что-то будет </div>
                    <div className="description">Участников: {group.users_count} </div>
                </div>
                <div className="extra content">
                    <div className="ui two buttons">
                        <div className="ui basic green button">Перейти</div>
                    </div>
                </div>
            </div>
        )
        if(!this.props.loading) {
            return(
              <Fragment>
                <div className="ui three stackable cards">
                    {listGroups}
                </div>
              </Fragment>
            );
        }
        else {
          return (
            <Fragment>
                <div class="ui three column stackable grid">
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="column">
                    <div class="ui raised segment">
                      <div class="ui placeholder">
                        <div class="image header">
                          <div class="line"></div>
                          <div class="line"></div>
                        </div>
                        <div class="paragraph">
                          <div class="medium line"></div>
                          <div class="short line"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </Fragment>
        );
        }
    }
}

export default withRouter(GroupsList);

