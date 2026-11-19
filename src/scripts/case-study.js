(() => {
  let state = 'current';
  const time = document.querySelector('#time');
  const status = document.querySelector('#status');
  const controls = document.querySelector('#actions');
  const labels = {propose:'Propose 7:30 PM', approve:'Approve change', decline:'Keep 7:00 PM'};
  const messages = {
    current:'The current reminder is set for 7:00 PM.',
    pending:'7:30 PM proposed. The older adult can approve or decline this change.',
    approved:'Approved. Everyone now sees the updated time.',
    declined:'Declined. The original reminder stays in place.'
  };
  function render() {
    const role = document.querySelector('input[name="role"]:checked').value;
    time.textContent = state === 'approved' ? '7:30 PM' : '7:00 PM';
    status.textContent = messages[state] + (role === 'family' ? ' Family members can view the shared schedule.' : '');
    controls.replaceChildren();
    for (const action of approvalFlow.actions(state, role)) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = labels[action];
      button.addEventListener('click', () => {
        state = approvalFlow.apply(state, role, action);
        render();
      });
      controls.append(button);
    }
  }
  document.querySelector('fieldset').addEventListener('change', render);
  document.querySelector('#reset').addEventListener('click', () => {
    state = 'current';
    document.querySelector('[value="caretaker"]').checked = true;
    render();
  });
  render();
})();
