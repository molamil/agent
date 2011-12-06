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

var _fb = function() {
	_s += "b";
}

Agent.observe("_f", _fb);

Agent.observe("_f", function() {
	_s += "c";
});

_f();

test("Agent on window scope", function() {

	equal(_s, "abc", "s = 'abc'");

	_s = "";
	Agent.ignore("_f", _fb);
	_f();
	equal(_s, "ac", "s = 'ac'");

});

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

});


// *** SCOPED

module("Scoped");

test("Priorities", function() {

	var s = "";
	var o = {};
	o.f = function() {
		s += "a";
	};

	Agent.observe(o, "f", function() {
		s += "d";
	}, 1);

	Agent.observe(o, "f", function() {
		s += "e";
	});

	Agent.observe(o, "f", function() {
		s += "b";
	}, 5);

	Agent.observe(o, "f", function() {
		s += "c";
	}, 5);

	o.f();

	equal(s, "abcde", "s = 'abcde'");

});

test("Ignore", function() {

	var s = "";
	var o = {};
	o.f = function() {
		s += "a";
	};

	var ob = function() {
		s += "b";
	};

	var oc = function() {
		s += "c";
	};

	Agent.observe(o, "f", ob);
	Agent.observe(o, "f", oc);

	Agent.ignore(o, "f", oc);
	Agent.ignore(o, "f", ob);

	o.f();

	equal(s, "a", "s = 'a'");

});

test("This context", function() {

	var o = {

		s: "",
		dot: ".",

		f: function() {
			this.s = "a";
		},

		addDot: function() {
			this.s += this.dot;
		}

	};

	var oo = {

		addDash: function() {
			this.s += "-";
		}

	};

	equal(o.s, "", "s = ''");

	o.f();
	equal(o.s, "a", "s = 'a'");

	Agent.observe(o, "f", o.addDot);
	o.f();
	equal(o.s, "a.", "s = 'a.'");

	Agent.observe(o, "f", oo.addDash, oo);
	o.f();
	equal(o.s, "a.", "s = 'a.'");

	Agent.ignore(o, "f", oo.addDash);
	Agent.observe(o, "f", oo.addDash, o);
	o.f();
	equal(o.s, "a.-", "s = 'a.-'");

	Agent.observe(o, "f", function() {
		this.s += "z";
	});
	o.f();
	equal(o.s, "a.-z", "s = 'a.-z'");

	var n = 0;
	var ooo = {
		n: 10
	};
	Agent.observe(o, "f", function() {
		n++;
	});
	o.f();
	equal(n, 1, "n = 1");
	equal(ooo.n, 10, "ooo.n = 10");
	equal(o.s, "a.-z", "s = 'a.-z'");

	Agent.observe(o, "f", function() {
		this.n++;
	});
	o.f();
	equal(n, 2, "n = 2");
	equal(ooo.n, 10, "ooo.n = 10");
	equal(o.s, "a.-z", "s = 'a.-z'");


	Agent.observe(o, "f", function() {
		this.n++;
	}, ooo);
	o.f();
	equal(n, 3, "n = 3");
	equal(ooo.n, 11, "ooo.n = 11");
	equal(o.s, "a.-z", "s = 'a.-z'");

});