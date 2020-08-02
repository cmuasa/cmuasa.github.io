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
	'can speak and read another language',
	'has an awful sleeping schedule',
	'is lactose intolerant',
	'plays an instrument (what instrument?)',
	'has painted the fence (with what org?)',
	'is involved in Greek life (what org)',
	'got tested for corona',
	'learned a tiktok dance in quarantine',
	'has been to 5+ raves/music festivals',
	'was born outside of the US (where?)',
	'has worn colored contacts AND falsies',
	'started a new project or hobby in quarantine',
	'dances often',
	'had big plans cancelled b/c of corona (what plans?)',
	'plays a sport (what sport?)',
	'had a mushroom haircut as a kid',
	'watches anime or kdramas (favorite?)',
	'dyed your hair or got bangs in quarantine',
	'has their name mispronounced often',
	'baked/cooked something new in quarantine',
	'has a pet (what pet?)',
	'excited about the fall semester (which part?)',
	'nervous or sad about the fall semester (which part?)',
	'has had bubble tea 3+ days in a row before',
];
shuffle(vals);

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = { clicked: false };
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.setState({ clicked: !this.state.clicked });
	}

	render() {
		if (this.state.clicked === false) {
			return (
				<Col className="square px-1" onClick={this.handleClick}>
					<p>{this.props.val}</p>
				</Col>
			);
		} else {
			return (
				<Col className="square clicked px-1" onClick={this.handleClick}>
					<p>{this.props.val}</p>
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
			<div className="App container text-center mb-5">
				<h1>ASA Orientation Bingo</h1>
				<p>Try to find someone that's described by each box!</p>
				<Container>
					<BingoRow rowNum={0} />
					<BingoRow rowNum={1} />
					<BingoRow rowNum={2} />
					<BingoRow rowNum={3} />
					<BingoRow rowNum={4} />
				</Container>
			</div>
		);
	}
}
