function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if(mode === -1) return;
	cm.sendNext("Hi, I'm #p9010002#.");
	cm.dispose();
}