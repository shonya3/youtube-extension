import { $ } from '../$';

const result = await $.navigation.ready();
if (result === 'ready') {
	$.navigation.shorts().remove();
	$.navigation.showMore().click();
	$.navigation.home().after($.navigation.liked());
	$.navigation.showLess().click();
}
