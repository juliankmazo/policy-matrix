export default function(){
	this.transition(
		this.fromRoute('objectives.index'),
		this.toRoute('objectives.new'),
		this.use('toLeft'),
		this.reverse('toRight')
	);

	this.transition(
		this.toRoute('policy'),
		this.use('toLeft'),
		this.reverse('toRight')
	);

	this.transition(
		this.toRoute('study'),
		this.use('toLeft'),
		this.reverse('toRight')
	);

	this.transition(
		this.toRoute('objectives'),
		this.use('toLeft'),
		this.reverse('toRight')
	);
	this.transition(
		this.toRoute('new'),
		this.use('toLeft'),
		this.reverse('toRight')
	);

	this.transition(
		this.toRoute('policy.edit'),
		this.use('toLeft'),
		this.reverse('toRight')
	);

	this.transition(
		this.fromRoute('studies.index'),
		this.toRoute('studies.new'),
		this.use('toUp'),
		this.reverse('toDown')
	);

	this.transition(
		this.fromRoute('policies.index'),
		this.toRoute('policies.new'),
		this.use('toUp'),
		this.reverse('toDown')
	);
}