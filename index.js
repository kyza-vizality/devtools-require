const { Plugin } = require("@vizality/core");

module.exports = class DevtoolsRequire extends (
	Plugin
) {
	async onStart() {
		globalThis.vzr = (module = "") => {
			module = module.trim();
			// No module? Just return the core.
			if (module.length === 0)
				Object.assign(require(`@vizality`), globalThis.vizality);
			try {
				// Try to get the module.
				return require(`@vizality/${module}`);
			} catch {
				// If that doesn't exist, get one of the normally exposed submodules.
				// As a last resort it might be a Node module.
				return (
					this.deepValue(
						Object.assign(require(`@vizality`), globalThis.vizality),
						module
					) ?? require(module)
				);
			}
		};
	}

	onStop() {
		delete globalThis.vzr;
	}

	deepValue(obj, path) {
		for (var i = 0, path = path.split("/"), len = path.length; i < len; i++) {
			obj = obj[path[i]];
		}
		return obj;
	}
};
