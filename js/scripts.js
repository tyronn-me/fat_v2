let appContainer = document.getElementById("appContainer");

class Init extends React.Component {

	constructor(props) {
    super(props);
		this.state = {
			pageTitle : null,
			pageContent : null,
			pageFeatured : null,
			pageTemplate : null,
			menuItems : null,
			classes : null
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

					$this.setState({ menuItems : menuItems });

        }


    };

		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send();

		this.getPageContent();
	}

	getPageContent(id) {

		var request = new XMLHttpRequest();
		let $this = this;
		let boxes = [];

		request.open("POST", ajaxurl + "?action=get_page_info", true);

		request.onreadystatechange = function() {

        if(this.readyState === 4 && this.status === 200) {

						let res = JSON.parse(this.responseText);
						console.log(res);

						$this.setState({
							pageTitle : res[0].title,
							pageContent : res[0].content,
							pageTemplate : res[0].template,
							pageFeatured : res[0].image
						});

						$this.preloadClassInfo();
        }


    };

		if ( !id ) {
			id = "";
		}

		request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		request.send("pageid=" + id);

	}

	preloadClassInfo() {
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

						$this.setState({ classes : boxes });

        }

    };

		request.send();
	}

	clickHandler(e) {
		let page = e.target.getAttribute("data-pageid");
		this.getPageContent(page);
		console.log(page);
	}

	render() {
			const menu = (this.state.menuItems || []).map((item) => {
				return <li className="nav-item"><a className="nav-link" href="#" data-pageid={item.id} onClick={this.clickHandler}>{item.title}</a></li>
			});
			console.log(this.state.classes);
			return(
				<div className="container-fluid" id="appRow">
				<React.StrictMode />
					<nav className="navbar navbar-light">
						<a className="navbar-brand" href="#">
							<img src={THEMEURL + "/images/logo2.png"} className="d-inline-block align-top" alt="" loading="lazy" />
						</a>
						<ul class="nav justify-content-center">
						{menu}
						</ul>
						<form class="d-flex">
			        <button class="btn btn-light" type="submit">Book A Class</button>
			      </form>
					</nav>
					<PageContent key={this.state.pageTemplate} template={this.state.pageTemplate} page={this.state.pageTitle} content={this.state.pageContent} image={this.state.pageFeatured} classes={this.state.classes} />
				</div>
			)
	}

}


class PageContent extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let cols = document.getElementsByClassName("animateElement");
		let character = document.getElementById("character");
		let featureCircle = document.getElementById("featureCircle");
		let elemArr = [];

		if ( featureCircle ) {
			elemArr.push({
				elem : featureCircle,
				class : "animate__zoomIn"
			});
		}

		if ( cols ) {
			for(var i = 0; i < cols.length; i++) {
				elemArr.push({
					elem : cols[i],
					class : "animate__fadeInLeft"
				});
			}
		}
		if ( character ) {
			elemArr.push({
				elem : character,
				class : "animate__fadeIn"

			});
		}

		for(var elIndex = 0; elIndex < elemArr.length; elIndex++) {
			this.animateElements(elemArr[elIndex], elIndex);
		}
	}

	animateElements(elem, index) {
		setTimeout(function() {
			elem["elem"].classList.add("animate__animated", elem["class"]);
		}, 250 * index);
	}

	render() {
		let template = this.props.template;
		let colClassL, colClassR;

		if ( template == undefined ) {
			return(<div></div>);
		}

		if ( template === "default" ) {
			colClassL = "cols col-md-7";
			colClassR = "cols col-md-3";
			return(
						<div className="row contentsRow" id={this.props.template}>
							<div className={colClassL}>
								<h2 className="animateElement">{this.props.page}</h2>
								<div className="animateElement" dangerouslySetInnerHTML={{ __html : this.props.content }}></div>
							</div>
							<div id="homefeatured">
								<img id="character" src={this.props.image} alt="Liina, Our instructor"/>
							</div>
							<div id="featureCircle" className="homeCircles"></div>
						</div>
					)
		}
		if ( template === "classes" ) {
			colClassL = "cols col-md-7";
			colClassR = "cols col-md-3";
			return(
						<div className="row contentsRow" id={this.props.template}>
							<ClassBoxes classes={this.props.classes}/>
						</div>
					)
		}
	}

}

class ClassBoxes extends React.Component {

	constructor(props) {
    super(props);
  }

	componentDidMount() {
		this.animateItems();
	}

	animateItems() {
		let classNameLinks = document.getElementsByClassName("classNameLinks");
		for(var i = 0; i < classNameLinks.length; i++) {
			this.runAnimation(classNameLinks[i], i);
		}
	}

	runAnimation(element, int) {
		setTimeout(function() {
			element.classList.add("animate__animated", "animate__fadeInLeft");
		}, 150 * int);
	}

	handleClick(e) {
		let classNameLinks = document.getElementsByClassName("classNameLinks");
		for(var i = 0; i < classNameLinks.length; i++) {
			classNameLinks[i].classList.remove("active");
		}

		e.target.classList.add("active");
	}

	render() {
		const titles = (this.props.classes || []).map((box) => {
			return <a href="#" onClick={this.handleClick} className="classNameLinks">{box.title}</a>
		});
		return(
			<div className="col-md-4" id="appRow">
				<div id="classLinkBox">
					{titles}
				</div>
			</div>
		)
	}

}

ReactDOM.render(<Init/>, appContainer);
