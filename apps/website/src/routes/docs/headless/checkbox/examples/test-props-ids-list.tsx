import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { CheckboxIndicator } from 'packages/kit-headless/src/components/checkbox/checkbox-indicator';
import { Checkbox } from 'packages/kit-headless/src/components/checkbox/checkbox';
import { CheckList } from 'packages/kit-headless/src/components/checkbox/checklist';
export default component$(() => {
  const firstUserSig = useSignal(true);
  const secondUserSig = useSignal(true);
  return (
    <>
      <h3 id="test123">Pick a cat</h3>
      <CheckList class="flex flex-col gap-3" ariaLabeledBy="test123">
        <Checkbox
          class="flex items-center gap-3 bg-slate-900 p-2 text-white"
          checkList={true}
          id="checklist"
        >
          <CheckboxIndicator class=" flex w-[80px] justify-center bg-white p-3">
            ✅
          </CheckboxIndicator>
          <p>Controlls all</p>
        </Checkbox>
        <Checkbox
          id="child-1"
          checkBoxSig={firstUserSig}
          class="flex items-center gap-3 bg-slate-900 pr-2 text-white"
        >
          <CheckboxIndicator class="w-fit bg-slate-600">✅</CheckboxIndicator>
          <p>First Child</p>
        </Checkbox>

        <Checkbox id="child-2" class="bg-slate-900 text-white">
          <div class="flex items-center gap-3">
            <CheckboxIndicator class="w-fit bg-slate-600">✅</CheckboxIndicator>
            <p>Second child</p>
          </div>
        </Checkbox>
      </CheckList>
    </>
  );
});
