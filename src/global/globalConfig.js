export const PAGE_SIZE = 10
export const PAG_CONFIG = {
  showQuickJumper: true,
  pageSizeOptions: ['5', '10', '20', '50'],
  showTotal: (total, range) => `${range[0]}条-${range[1]}条 共${total}条`
}
