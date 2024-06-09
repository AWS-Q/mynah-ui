/*!
 * Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { Root, createRoot } from 'react-dom/client';
import { Select } from '@cloudscape-design/components';
import { useState } from 'react';
import { DomBuilder, SelectAbstract, SelectProps } from '@aws/mynah-ui';

interface MynahUISelectProps extends SelectProps {
  disabled?: boolean;
}

export const MynahUISelect = (props: MynahUISelectProps): JSX.Element => {
  const findSelected = (val: string): { value: string; label: string } | null =>
    props.options?.find((opt) => opt.value === val) ?? null;
  const [value, setValue] = useState<string | undefined>(
    findSelected(props.value ?? '')?.value
  );

  return (
    <>
      {props.label != null && (
        <span
          className='mynah-form-input-label'
          ref={(ref) => {
            if (ref != null) {
              (ref as HTMLElement).innerHTML = '';
            }
            if (typeof props.label === 'string') {
              ref?.appendChild(document.createTextNode(props.label));
            } else if (typeof props.label !== 'undefined') {
              ref?.appendChild(props.label);
            }
          }}
        />
      )}
      <Select
        onChange={(e:any) => {
          setValue(e.detail.selectedOption.value ?? '');
          if (props.onChange != null) {
            props.onChange(e.detail.selectedOption.value ?? '');
          }
        }}
        placeholder={props.placeholder ?? '...'}
        selectedOption={findSelected(value ?? '')}
        disabled={props.disabled}
        options={props.options}
      />
    </>
  );
};

export class CloudscapeMynahUISelect extends SelectAbstract {
  private readonly root: Root;
  private readonly props: SelectProps;
  private disabled: boolean = false;
  constructor(props: SelectProps) {
    super();
    this.props = props;
    this.render = DomBuilder.getInstance().build({
      type: 'span',
      classNames: [
        'mynah-ui-cloudscape-select-wrapper',
        'mynah-form-input-wrapper',
        ...(this.props.classNames ?? []),
      ],
      attributes: this.props.attributes,
    });
    this.root = createRoot(this.render);
    this.updateRender();
  }

  private readonly onChangeHandler = (value: string): void => {
    this.props.value = value;
    if (this.props.onChange != null) {
      this.props.onChange(value);
    }
  };

  private readonly updateRender = (): void => {
    this.root.render(
      <MynahUISelect
        {...this.props}
        onChange={this.onChangeHandler}
        disabled={this.disabled}
      />
    );
  };

  setValue = (value: string): void => {
    this.props.value = value;
    this.updateRender();
  };

  getValue = (): string => this.props.value ?? '';

  setEnabled = (enabled: boolean): void => {
    this.disabled = !enabled;
    this.updateRender();
  };
}
