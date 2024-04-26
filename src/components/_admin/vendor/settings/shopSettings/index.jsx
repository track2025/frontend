import React from 'react';
import ShopSettingFrom from 'src/components/forms/shopSetting';
import PropTypes from 'prop-types';
ShopSettingMain.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired
};
export default function ShopSettingMain({ data, isLoading }) {
  return (
    <div>
      <ShopSettingFrom isLoading={isLoading} data={data} />
    </div>
  );
}
