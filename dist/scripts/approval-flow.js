// Keep the role rules shared between the walkthrough and its regression tests.
const approvalFlow = (() => {
  const rules = {
    current: { caretaker: { propose: 'pending' } },
    pending: { adult: { approve: 'approved', decline: 'declined' } }
  };
  function apply(state, role, action) {
    return rules[state]?.[role]?.[action] ?? state;
  }
  function actions(state, role) {
    return Object.keys(rules[state]?.[role] ?? {});
  }
  return { apply, actions };
})();
if (typeof module !== 'undefined') module.exports = approvalFlow;
