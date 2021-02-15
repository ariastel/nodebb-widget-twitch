'use strict';

const nconf = require.main.require('nconf');
const url = require('url');

let app;
const Widget = {};

Widget.init = async function (params) {
	app = params.app;
};

Widget.defineWidgets = async function (widgets) {
	return widgets.concat([
		{
			widget: 'aa_twitch',
			name: 'Twitch',
			description: 'Displays a Twitch stream.',
			content: await app.renderAsync('admin/twitch', {}),
		}
  ]);
}

Widget.renderTwitchWidget = async function (widget) {
	if (!isVisibleInCategory(widget)) {
		return null;
	}
	const data = {
    channel_name: widget.data.channel_name,
    parent_url: url.parse(nconf.get('url')).hostname,
    autoplay: widget.data.autoplay === 'on',
    muted: widget.data.muted === 'on',
  };
	widget.html = await app.renderAsync('widgets/twitch', data);
	return widget;
};

module.exports = Widget;


function getCidsArray(widget) {
	const cids = widget.data.cid || '';
	return cids.split(',').map(c => parseInt(c, 10)).filter(Boolean);
}

function isVisibleInCategory(widget) {
	const cids = getCidsArray(widget);
	return !(cids.length && (widget.templateData.template.category || widget.templateData.template.topic) && !cids.includes(parseInt(widget.templateData.cid, 10)));
}