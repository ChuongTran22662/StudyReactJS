import React, { Component } from 'react';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';
import './App.css'
import _ from 'lodash'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isDisplayForm: false,
            taskEditing: null,
            filter: {
                name: '',
                status: -1
            },
            sortBy: 'name',
            sortValue: 1
        }
    }

    //goi khi refresh lai trinh duyet
    componentWillMount() {
        if (localStorage && localStorage.getItem('tasks')) {
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            this.setState({
                tasks: tasks
            })
        }
    }

    onToggleForm = () => {
        if (this.state.isDisplayForm && this.state.taskEditing !== null) {
            this.setState({
                isDisplayForm: true,
                taskEditing: null
            })
        } else {
            this.setState({
                isDisplayForm: !this.state.isDisplayForm,
                taskEditing: null
            })
        }
    }

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    generateID() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
    }

    onCloseForm = () => {
        this.setState({
            isDisplayForm: false
        })
    }

    onSubmit = (data) => {
        //console.log(data)
        var { tasks } = this.state; //tasks = this.state.tasks
        if (data.id === '') {
            data.id = this.generateID();
            tasks.push(data);
        } else {
            var index = this.findIndex(data.id);
            tasks[index] = data;
        }

        this.setState({
            tasks: tasks,
            taskEditing: null
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    findIndex = (id) => {
        var { tasks } = this.state;
        var result = -1;
        tasks.forEach((task, index) => {
            if (task.id === id) {
                result = index
            }
        })
        return result;
    }

    onUpdateStatus = (id) => {
        //console.log(id);
        var { tasks } = this.state;
        //var index = this.findIndex(id);

        var index = _.findIndex(tasks, (task) => {
            return task.id === id;
        })

        if (index !== -1) {
            tasks[index].status = !tasks[index].status;
            this.setState({
                tasks: tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

    }

    onDelete = (id) => {
        var { tasks } = this.state;
        var index = this.findIndex(id);

        if (index !== -1) {
            //tasks[index].status = !tasks[index].status;
            tasks.splice(index, 1);
            this.setState({
                tasks: tasks
            })
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        //console.log(id)
        this.onCloseForm();
    }

    onUpdate = (id) => {
        //console.log(id);'
        var { tasks } = this.state;
        var index = this.findIndex(id);
        var taskEditing = tasks[index];

        this.setState({
            taskEditing: taskEditing
        })

        this.onShowForm();

        //this.onToggleForm();

        //console.log(this.state.taskEditing);

        //console.log(taskEditing);
    }

    onShowForm() {
        this.setState({
            isDisplayForm: true
        })
    }

    onFilter = (filterName, filterStatus) => {
        filterStatus = parseInt(filterStatus, 10);
        //console.log(filterName + '  ' + filterStatus);
        this.setState({
            filter: {
                name: filterName.toLowerCase(),
                status: filterStatus
            }
        })
    }

    onSearch = (keyword) => {
        this.setState({
            keyword: keyword
        })
    }

    onSort = (sortBy, sortValue) => {
        /// console.log(sortBy+ sortValue);
        this.setState({
            sortBy: sortBy,
            sortValue: sortValue
        });
        //console.log(this.state);
    }

    render() {

        var { tasks, isDisplayForm, taskEditing, filter, keyword, sortBy, sortValue } = this.state;
        //console.log(filter);
        if (filter) {
            if (filter.name) {
                tasks = tasks.filter((task) => {
                    return task.name.toLowerCase().indexOf(filter.name) !== -1;
                })
            }
            tasks = tasks.filter((task) => {
                if (filter.status === -1) {
                    return task;
                } else {
                    return task.status === (filter.status === 1 ? true : false);
                }
            })
        }

        if (keyword) {
            tasks = tasks.filter((task) => {
                return task.name.toLowerCase().indexOf(keyword) !== -1;
            })
        }

        // tasks = _.filter(tasks, (task) => {
        //     return task.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
        // });

        if (sortBy === 'name') {
            tasks.sort((a, b) => {
                if (a.name > b.name) return sortValue;
                else if (a.name < b.name) return -sortValue;
                else return 0;
            })
        } else {
            tasks.sort((a, b) => {
                if (a.status > b.status) return -sortValue;
                else if (a.status < b.status) return sortValue;
                else return 0;
            })
        }

        var elmTaskForm = isDisplayForm === true ?
            <TaskForm
                onSubmit={this.onSubmit}
                onCloseForm={this.onCloseForm}
                task={taskEditing}
            />
            : '';

        return (
            <div className="container">
                <nav className="navbar navbar-expand-lg">
                    <div id="logo">
                        <a href="https://mtpentertainment.com">
                            <img src="https://mtpentertainment.com/wp-content/themes/v-theme/images/logo.png" alt="Logo" className="d-none d-lg-block" />
                            <img src="https://mtpentertainment.com/wp-content/themes/v-theme/images/logo_mobile.png" alt="Logo" className="d-block d-lg-none d-xl-none" />
                        </a>
                    </div>
                    <h1 className="display-1 job">&nbsp;&nbsp;Job Management</h1>
                    <button className="navbar-toggler nav-button border-0" type="button" data-toggle="offcanvas">
                        <i className="far fa-bars"></i>
                    </button>
                </nav>
                <hr />

                <div className="row">
                    <div className={isDisplayForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" :
                        "col-xs-0 col-sm-0 col-md-0 col-lg-0"}>
                        {elmTaskForm}
                    </div>
                    <div className={isDisplayForm ? "col-xs-8 col-sm-8 col-md-8 col-lg-8" :
                        "col-xs-12 col-sm-12 col-md-12 col-lg-12"}>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.onToggleForm}
                        >
                            <span className="fa fa-plus mr-5"></span> Add job
                        </button>
                        <br />
                        <br />
                        <Control
                            onSearch={this.onSearch}
                            onSort={this.onSort}
                            sortBy={sortBy}
                            sortValue={sortValue}
                        />
                        <div className="row mt-15">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <TaskList
                                    tasks={tasks}
                                    onUpdateStatus={this.onUpdateStatus}
                                    onDelete={this.onDelete}
                                    onUpdate={this.onUpdate}
                                    onFilter={this.onFilter}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <p>Designed by Tran Chuong <a href="https://www.facebook.com/62pm3lovelyboy">facebook</a>.</p>
            </div>
        );
    }
}

export default App;
