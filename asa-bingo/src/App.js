import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
var vals = [
	'Can speak and read another language',
	'Has an awful sleeping schedule',
	'Is lactose intolerant',
	'Plays an instrument (what instrument?)',
	'Has painted the fence (with what org?)',
	'Is involved in Greek life (what org?)',
	'Got tested for corona',
	'Learned a tiktok dance in quarantine',
	'Has been to 5+ raves/music festivals',
	'Was born outside of the US (where?)',
	'Gas worn colored contacts AND falsies',
	'Started a new project or hobby in quarantine',
	'Dances often',
	'Had big plans cancelled b/c of corona (what plans?)',
	'Plays a sport (what sport?)',
	'Had a mushroom haircut as a kid',
	'Watches anime or kdramas (favorite?)',
	'Dyed your hair or got bangs in quarantine',
	'Has their name mispronounced often',
	'Baked/cooked something new in quarantine',
	'Has a pet (what pet?)',
	'Excited about the fall semester (which part?)',
	'Nervous or sad about the fall semester (which part?)',
	'Has had bubble tea 3+ days in a row before',
];
shuffle(vals);

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = { clicked: false };
		this.handleClick = this.handleClick.bind(this);

		this.handleChange = this.handleChange.bind(this);
	}

	handleClick() {
		if (this.state.clicked === true) {
			this.setState({ clicked: false });
		}
	}

	handleChange() {
		this.setState({ clicked: true });
	}

	render() {
		if (this.state.clicked === false) {
			return (
				<Col className="d-flex flex-column square px-1">
					<p>{this.props.val}</p>
					<textarea rows="2" placeholder="(names)" onChange={this.handleChange}></textarea>
				</Col>
			);
		} else {
			return (
				<Col className="d-flex flex-column square clicked px-1" onClick={this.handleClick}>
					<p>{this.props.val}</p>
					<textarea rows="2" placeholder="(names)" onChange={this.handleChange}></textarea>
				</Col>
			);
		}
	}
}

class BingoRow extends React.Component {
	render() {
		var first = vals[this.props.rowNum * 5];
		var second = vals[this.props.rowNum * 5 + 1];
		var third = vals[this.props.rowNum * 5 + 2];
		var fourth = vals[this.props.rowNum * 5 + 3];
		var fifth = vals[this.props.rowNum * 5 + 4];

		if (this.props.rowNum === 2) {
			third = 'Loves ASA (Free)';
		}
		if (this.props.rowNum === 4) {
			fifth = vals[12];
		}

		return (
			<Row>
				<Square val={first} />
				<Square val={second} />
				<Square val={third} />
				<Square val={fourth} />
				<Square val={fifth} />
			</Row>
		);
	}
}

export class App extends React.Component {
	render() {
		return (
			<div className="App container text-center my-sm-3">
				<div className="title">
					<h1 className="asa">ASA Orientation Bingo</h1>
					<p>Try to find someone that's described by each box!</p>
					<p>Fill out the Check-in Form for our Contact Sheet!</p>
				</div>
				<Container>
					<BingoRow rowNum={0} />
					<BingoRow rowNum={1} />
					<BingoRow rowNum={2} />
					<BingoRow rowNum={3} />
					<BingoRow rowNum={4} />
				</Container>
				<button className="btn btn-dark m-3">New Board</button>
				<button className="btn btn-dark m-3">Clear Board</button>
			</div>
		);
	}
}
