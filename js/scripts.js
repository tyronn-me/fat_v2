let appContainer = document.getElementById("appContainer");

class Init extends React.Component {

	constructor(props) {
    super(props);
		this.state = {
			pages : null,
			menuItems : null
		}

		this.clickHandler = this.clickHandler.bind(this);
  }

	componentDidMount() {

		var request = new XMLHttpRequest();
		let $this = this;
		let menuItems = [];

		request.open("POST", ajaxurl + "?action=create_menu", true);

		request.onreadystatechange = function() {

        if(this.readyState === 4 && this.status === 200) {

					let res = JSON.parse(this.responseText);
					let obj = res;
					let objL = obj.length;
					let menuItems = [];

					console.log(obj);

					for(var i = 0; i < objL; i++) {
							menuItems.push({
								id : obj[i].id,
								title : obj[i].title
							});
					}

					$this.setState({menuItems : menuItems});

        }


    };

		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send();

		this.getPageContent();
	}

	getPageContent() {

		var request = new XMLHttpRequest();
		let $this = this;
		let boxes = [];

		request.open("POST", ajaxurl + "?action=get_page_info", true);

		request.onreadystatechange = function() {

        if(this.readyState === 4 && this.status === 200) {

						let res = JSON.parse(this.responseText);
						console.log(res);

						$this.setState({ pages : res });

						console.log($this.state.pages);

        }


    };

		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send();

	}

	clickHandler(e) {
		let page = e.target.getAttribute("data-pageid");
		// this.setState({ page : page }, this.forceUpdate);
		console.log(page);
	}

	render() {
			const menu = (this.state.menuItems || []).map((item) => {
				return <li className="nav-item"><a className="nav-link" href="#" data-pageid={item.id} onClick={this.clickHandler}>{item.title}</a></li>
			});
			return(
				<div className="container-fluid" id="appRow">
					<nav className="navbar navbar-light">
						<a className="navbar-brand" href="#">
							<img src={THEMEURL + "/images/logo2.png"} className="d-inline-block align-top" alt="" loading="lazy" />
						</a>
						<ul class="nav justify-content-end">
						{menu}
						</ul>
					</nav>
					<PageContent />
				</div>
			)
	}

}


class PageContent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			page : null,
			title : null,
			content : null
		};
	}

	componentWillReceiveProps(props) {
		let $this = this;
		this.setState({ page : this.props.pageid }, $this.getPageContent);
	}

	render() {
		return(
			<div className="row">
				<div className="col-md" id="pageContent">
					<h2 className="display-4">{this.state.page}</h2>
					<p className="">{this.state.content}</p>
				</div>
			</div>
		);
	}

}

class ClassBoxes extends React.Component {

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
			<div className="col-md" id="appRow">
			{divs}
			</div>
		)
	}

}

ReactDOM.render(<Init/>, appContainer);
