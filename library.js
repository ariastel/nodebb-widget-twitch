'use strict';

const nconf = require.main.require('nconf');


let app;
const Widget = {};

/**
 * Called on `static:app.load`
 */
Widget.init = async function (params) {
	app = params.app;
};

/**
 * Called on `filter:widgets.getWidgets`
 */
Widget.defineWidgets = async function (widgets) {
	return widgets.concat([
		{
			widget: 'aa_twitch',
			name: 'Twitch',
			description: 'Displays a Twitch stream.',
			content: await app.renderAsync('admin/twitch', {}),
		},
	]);
};

/**
 * Called on `filter:widget.render:aa_twitch`
 */
Widget.renderTwitchWidget = async function (widget) {
	if (widget.templateData.template.category && !isVisibleInCategory(widget)) {
		return null;
	}

	const data = {
		channel_name: widget.data.channel_name,
		parent_url: new URL(nconf.get('url')).hostname,
		autoplay: widget.data.autoplay === 'on',
		muted: widget.data.muted === 'on',
	};
	widget.html = await app.renderAsync('widgets/twitch', data);

	return widget;
};

module.exports = Widget;


/**
 * @param {*} widget
 * @returns {number[]}
 */
function getCidsArray(widget) {
	const cids = widget.data.cid || '';
	return cids.split(',').map(c => parseInt(c, 10)).filter(Boolean);
}

/**
 * @param {*} widget
 * @returns {boolean}
 */
function isVisibleInCategory(widget) {
	const cids = getCidsArray(widget);
	return cids.length && cids.includes(parseInt(widget.templateData.cid, 10));
}
