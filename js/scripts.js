let appContainer = document.getElementById("appContainer");

class Init extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
			boxes : null
		};
  }

	componentDidMount() {

		var request = new XMLHttpRequest();
		let $this = this;
		let boxes = [];

		request.open("POST", ajaxurl + "?action=get_fat_info");

		request.onreadystatechange = function() {

        if(this.readyState === 4 && this.status === 200) {

						let res = JSON.parse(this.responseText);
						let obj = res.data;
						let boxArrCheck = [];
						let objL = obj.length;

						for(var i = 0; i < objL; i++) {
							console.log(obj[i].attributes["title"]);
							if ( boxArrCheck.indexOf(obj[i].attributes["title"]) == -1 ) {
								boxArrCheck.push(obj[i].attributes["title"]);
								boxes.push(obj[i].attributes["title"]);
							}
						}

						$this.setState({boxes : boxes});
        }


    };

		request.send();

	}

	render() {
		const divs = (this.state.boxes || []).map((box) => {
			return <div className="classCol"><h1 className="display-4">{box}</h1></div>
		});
		console.log(divs);
		return(
			<div className="row" id="appRow">
			{divs}
			</div>
		)
	}

}

ReactDOM.render(<Init/>, appContainer);
