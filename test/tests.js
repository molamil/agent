/*
 * AGENT - Unit test suite
 *
 * Author: Jorge Hernandez
 *
 */


// *** TOP LEVEL

module("Top level");

var _s = "";

var _f = function() {
	_s += "a";
};

Agent.observe("_f", function() {
	_s += "b";
});

Agent.observe("_f", function() {
	_s += "c";
});

_f();

test("Agent on window scope", function() {

		equal(_s, "abc", "s = 'abc'");

	}
);

test("Agent on function scope", function() {

		var s = "";

		var o = {};

		o.f = function() {
			s += "a";
		};

		Agent.observe(o, "f", function() {
			s += "b";
		}, 10);

		Agent.observe(o, "f", function() {
			s += "c";
		}, 5);

		Agent.observe(o, "f", function() {
			s += "d";
		}, 5);

		Agent.observe(o, "f", function() {
			s += "e";
		});

		Agent.observe(o, "f", function() {
			s += "f";
		});

		var fz = function() {
			s += "z";
		};
	
		Agent.observe(o, "f", fz);

		Agent.ignore(o, "f", fz);

		o.f();

		equal(s, "abcdef", "s = 'abcdef'");

	}
);


// *** SCOPED

module("Scoped");

test("Priorities", function() {

		var s = "";

		var f = function() {
			s += "a";
		};

		Agent.observe(this, "f", function() {
			s += "b";
		}, 1);

		Agent.observe(this, "f", function() {
			s += "c";
		}, 1);

		f();
	
		equal(s, "abc", "s = 'abc'");

	}
);