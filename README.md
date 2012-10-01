Agent - JavaScript function interceptor
=======================================

Agent is a slim JavaScript library that allows observing function calls by hooking further code to be executed when an observed function is invoked.

Agent can be used as an [aspect-oriented programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming) tool, as it enables definition of advices (hook functions) that can be linked to join points (observed functions). Practical AOP applications include logging, persistance and authentication.

Apart from achieving AOP functionality, Agent can also be using in a number of different practical scenarios. Some are displayed on the examples below.


Usage
-----

`Agent` is provided as a simple JavaScript object containing 2 public methods:  


### Agent.observe()

Observes every time a given function or method is called, and attaches another function to be executed when that happens. A hook function can only be added once to a given observed function, subsequent attempts to add the same hook function will be ignored. All parameters passed to the original function will also be passed to the hooked functions.

The supported method signatures are:

* `observe(fName, hook)`
* `observe(fName, hook, thisContext)`
* `observe(fName, hook, priority)`
* `observe(fName, hook, thisContext, priority)`
* `observe(o, fName, hook)`
* `observe(o, fName, hook, thisContext)`
* `observe(o, fName, hook, priority)`
* `observe(o, fName, hook, thisContext, priority)`

**Arguments:**

* **fName** _(string)_ Name of the function to observe. Example: `"onload"`.
* **hook** _(function)_ Function to be executed when the observed function is called. Example: `function() { alert("Hi there"); }`.
* **o** _(object)_ Object that contains the function to observe (defined by `fName`). Example: `window`.
* **thisContext** _(object)_ Value of `this` to be applied to the hook function. Example: `MyObject`.
* **priority** _(number)_ Priority level of the hook, higher priorities will be executed before lower priorities. If two or more hooks have the same priority, they are executed on the order they were registered. Example: `10`.


### Agent.ignore()

Stops observing a previously hooked function:

* `ignore(fName, hook)`
* `ignore(o, fName, hook)`

**Arguments:**

* **fName** _(string)_ Name of the function holding the hook to ignore. Example: `"onload"`.
* **hook** _(function)_ Function previously hooked via the `observe()` method. Example: `myFunction`.
* **o** _(object)_ Object that contains the function to observe. Example: `window`.


Examples
--------

The following examples show some practical usages of Agent. All the examples are available in the test directory.

---

### Wrapping window.onload:

    window.onload = function() {
        alert("Default window.onload");
    };

    Agent.observe("onload", function() {
        alert("Hooked function");
    });

---

### Logging every time jQuery.append is called:

    $(function() {
        
        // Observing the append method on jQuery's prototype.
        Agent.observe($.prototype, "append", function(content) {
            if (window.console && (typeof window.console.log == "function"))
                window.console.log("jquery.append called with parameter: " + content);
        });
        
        $("body").append("<h1>Hello World!</h1>");
        
    });
    
---

### Overloading callback functions instead of using events:

    var Me = {

        name: "Jorge",

        sayHi: function() {
            var hi = "Hi";
            alert(hi);
            this.onSpeak(hi);
        },

        saySomethingElse: function(something) {
            alert(something);
            this.onSpeak(something);
        },

        onSpeak: function(message) {
            // Do nothing.
        }

    };

    Agent.observe(Me, "onSpeak", function(message) {
        alert(Me.name + " has spoken: " + message);
    });

    Me.sayHi();
    Me.saySomethingElse("I am hungry");
    
---

### Persistence - saving user in a cookie every time a value object is updated:

    var User = function() {
        this._name = null;
        this._age = 0;
    };
    User.prototype = {

        getName: function() {
            return this._name;
        },

        setName: function(name) {
            this._name = name;
        },

        getAge: function() {
            return this._age;
        },

        setAge: function(age) {
            this._age = age;
        }

    };

    var UserCookieManager = {

        loadUser: function() {

            var cookies = document.cookie.split(";"),
                i,
                cName,
                cValue,
                name,
                age,
                user;

            for (i = 0; i < cookies.length; i++) {
                cName = cookies[i].substr(0, cookies[i].indexOf("="));
                cValue = cookies[i].substr(cookies[i].indexOf("=") + 1);
                cName = cName.replace(/^\s+|\s+$/g,"");
                if (cName == "name") {
                    name = cValue;
                } else if (cName == "age") {
                    age = cValue;
                }
            }

            if (name && age) {
                user = new User();
                user._name = name;
                user._age = age;
                }

            return user;

        },

        saveUser: function() {
            document.cookie = "name=" + this._name;
            document.cookie = "age=" + this._age;
        }

    };

    // Load the user from cookie or create a new one.
    var currentUser = UserCookieManager.loadUser() || new User();

    // Save in cookie every time the user is updated. Set currentUser as the this context for the hook function.
    Agent.observe(User.prototype, "setName", UserCookieManager.saveUser, currentUser);
    Agent.observe(User.prototype, "setAge", UserCookieManager.saveUser, currentUser);

    // If there is no user filled in, initialize one.
    if (!currentUser.getName()) {
        currentUser.setName("Jorge");
        currentUser.setAge(32);
    }