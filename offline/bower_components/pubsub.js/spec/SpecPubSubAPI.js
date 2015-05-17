/*
 * pubsub.js API unit tests
 *
 * @author Federico "Lox" Lucignano
 * <https://plus.google.com/117046182016070432246>
 */

/*global describe, it, expect, afterEach, PubSub*/
describe("API", function () {
	'use strict';

	describe("Subscribing to a channel", function () {
		var a = function () {};

		it("Shouldn't fail if channel doesn't exist", function () {
			expect(function () {
				PubSub.subscribe('/test/subscribing/1', a);
			}).not.toThrow();
		});

		it("Should fail if channel not passed", function () {
			expect(function () {
				PubSub.subscribe(undefined, a);
			}).toThrow();
		});

		it("Should fail if callback not passed", function () {
			expect(function () {
				PubSub.subscribe('/test/subscribing/2');
			}).toThrow();
		});

		it("Should return a valid handle", function () {
			var c = "/test/subscribing/3",
				h = PubSub.subscribe(c, a);

			expect(h).toBeDefined();
			expect(h instanceof Object).toEqual(true);
			expect(h.channel).toEqual(c);
			expect(h.callback).toBe(a);
		});
	});

	describe("Publishing a message", function () {
		it("Shouldn't fail if channel doesn't exist", function () {
			expect(function () {
				PubSub.publish("/test/publishing/1", 1);
			}).not.toThrow();
		});

		it("Shouldn't fail if data not passed", function () {
			expect(function () {
				PubSub.publish("/test/publishing/2");
			}).not.toThrow();
		});

		it("Should run the registered callback", function () {
			var check,
				c = "/test/publishing/3",
				a = function (val) {
					check = val;
				};

			PubSub.subscribe(c, a);
			PubSub.publish(c, 1);
			expect(check).toEqual(1);
		});

		it("Should support any type and number of data arguments", function () {
			var argCount,
				c = "/test/publishing/4",
				a = function () {
					argCount = arguments.length;
				};

			PubSub.subscribe(c, a);

			PubSub.publish(c, 1, "2", [3]);
			expect(argCount).toEqual(3);

			PubSub.publish(c, {type: "test"});
			expect(argCount).toEqual(1);
		});
	});

	describe("Unsubscribing from a channel", function () {
		var invoked = false,
			a = function () {
				invoked = true;
			};

		afterEach(function () {
			invoked = false;
		});

		it("Should fail if channel not passed", function () {
			expect(function () {
				PubSub.unsubscribe(undefined, a);
			}).toThrow();
		});

		it("Should fail if callback not passed", function () {
			expect(function () {
				PubSub.unsubscribe("/test/unsubscribe/1");
			}).toThrow();
		});

		it("Should fail if not valid handle", function () {
			expect(function () {
				PubSub.unsubscribe(5, a);
			}).toThrow();

			expect(function () {
				PubSub.unsubscribe([5, a]);
			}).toThrow();

			expect(function () {
				PubSub.unsubscribe([a]);
			}).toThrow();
		});

		it("Should fail if not valid callback", function () {
			expect(function () {
				PubSub.unsubscribe("/test/unsubscribe/2", {});
			}).toThrow();
		});

		it("Shouldn't' fail if channel doesn't exists", function () {
			expect(function () {
				PubSub.unsubscribe("/test/unsubscribe/3", a);
			}).not.toThrow();
		});

		it("Shouldn't' fail when passing a valid handle", function () {
			expect(function () {
				PubSub.unsubscribe(
					PubSub.subscribe("/test/unsubscribe/4", a),
					a
				);
			}).not.toThrow();
		});

		it("Shouldn't run an unsubscribed handler", function () {
			var c = "/test/unsubscribe/5",
				x = PubSub.subscribe(c, a);


			PubSub.publish(c);
			expect(invoked).toEqual(true);

			invoked = false;
			PubSub.unsubscribe(x);
			PubSub.publish(c);
			expect(invoked).toEqual(false);

			x = PubSub.subscribe(c, a);
			PubSub.publish(c);
			expect(invoked).toEqual(true);

			invoked = false;
			PubSub.unsubscribe(c, a);
			PubSub.publish(c);
			expect(invoked).toEqual(false);
		});
	});
});
