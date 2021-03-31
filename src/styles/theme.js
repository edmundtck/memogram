import { createMuiTheme } from '@material-ui/core/styles';
import styles from './export.module.scss';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: styles.colorPrimary
		},
		secondary: {
			main: styles.colorSecondary
		}
	}
});

export default theme;
