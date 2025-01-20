import { FC } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { FaRobot, FaCode, FaGithub } from 'react-icons/fa';
import { IoMdChatboxes } from 'react-icons/io';

const App: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaRobot className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Support Widget Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience our intelligent chat support widget. Click the chat button in the bottom right corner to start a conversation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <FeatureCard
            icon={<IoMdChatboxes className="w-8 h-8" />}
            title="Easy Integration"
            description="Simple one-line installation. Add the widget to any website in seconds."
          />
          <FeatureCard
            icon={<FaRobot className="w-8 h-8" />}
            title="AI-Powered"
            description="Intelligent responses powered by advanced AI technology."
          />
          <FeatureCard
            icon={<FaCode className="w-8 h-8" />}
            title="Customizable"
            description="Easily customize the appearance to match your brand."
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Installation</h2>
          <p className="text-gray-600 mb-4">
            Add the following code snippet to your website:
          </p>
          <div className="bg-gray-800 rounded-lg p-4 relative">
            <code className="text-green-400 text-sm font-mono block overflow-x-auto">
              {`<script src="https://incomparable-froyo-d0582a.netlify.app/widget.js"></script>`}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  '<script src="https://incomparable-froyo-d0582a.netlify.app/widget.js"></script>'
                );
              }}
              className="absolute top-2 right-2 bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <FaGithub className="w-6 h-6" />
            </a>
          </div>
        </footer>
      </div>
      <ChatWidget />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default App;