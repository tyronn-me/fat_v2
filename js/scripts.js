let appContainer = document.getElementById("appContainer");

class Init extends React.Component {

	constructor(props) {
    super(props);
		this.state = {
			page : "landing"
		}
  }

	componentDidMount() {

	}

	render() {
		if ( this.state.page == "landing" ) {
			return(
				<div className="container-fluid" id="appRow">
					<Landing />
				</div>
			)
		}
	}

}

class Landing extends React.Component {

	constructor(props) {
    super(props);
    this.state = {
			boxes : null
		};

		this.hoverState = this.hoverState.bind(this);
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

						console.log(obj);

						for(var i = 0; i < objL; i++) {
							if ( boxArrCheck.indexOf(obj[i].attributes["title"]) == -1 ) {
								boxArrCheck.push(obj[i].attributes["title"]);
								boxes.push({
									number : "0" + ( i + 1 ),
									title : obj[i].attributes["title"],
									details : obj[i].attributes["details"]
								});
							}
						}

						$this.setState({boxes : boxes});

						$this.applyBoxClasses();
        }


    };

		request.send();

	}

	applyBoxClasses() {

		let boxes = document.getElementsByClassName("classCol");
		let winH = window.innerHeight;
		for(var i = 0; i < boxes.length; i++) {
			boxes[i].style.height = winH + "px";
			if ( i == 0 ) {
				boxes[i].classList.add("active");
			} else {
				boxes[i].classList.add("not_active")
			}
		}

	}

	hoverState(e) {
		console.log("hovered");
		let boxes = document.getElementsByClassName("classCol");
		let elemIndex = this.getElementIndex(e.target);

		console.log(elemIndex);

		for(var i = 0; i < boxes.length; i++) {
			if ( i == elemIndex ){
				boxes[i].classList.remove("not_active");
				boxes[i].classList.add("active");
			} else {
				boxes[i].classList.remove("active");
				boxes[i].classList.add("not_active");
			}
		}

	}

	getElementIndex(element) {
  	return Array.from(element.parentNode.children).indexOf(element);
	}

	render() {
		const divs = (this.state.boxes || []).map((box) => {
			return <div className="classCol" onMouseEnter={this.hoverState}><div className="innerClassCol"><h3 className="h1">{box.number}</h3><div className="boxText"><h2 className="display-4">{box.title}</h2><p>{box.details}</p><a href="" className="btn btn-outline-warning">Book a class now</a></div></div></div>
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
