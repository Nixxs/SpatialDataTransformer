import "./App.css";
import Content from "./components/Content";
import Layout from "./components/Layout";
import ThemeProvider from "./components/ThemeContext";
import { FC} from 'react';


const App:FC = () =>  {
	return (
		<ThemeProvider>
			<Content>
				<Layout />
			</Content>
		</ThemeProvider>
	);
}

export default App;
