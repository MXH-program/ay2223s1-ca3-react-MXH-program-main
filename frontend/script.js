class Menu extends React.Component
{
    constructor() {
        super()
    }

    render()
    {
        return (
            <div>
                <h1>Hello React!</h1>
            </div>
        );
    }
}

ReactDOM.render(
    React.createElement(Menu, {}),
    document.getElementById('root')
);