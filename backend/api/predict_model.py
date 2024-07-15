import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import os

# Check if GPU is available
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Define the CNN model
class ConvolutionalNetwork(nn.Module):
    def __init__(self):
        super(ConvolutionalNetwork, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, 1)
        self.conv2 = nn.Conv2d(32, 64, 3, 1)
        self.conv3 = nn.Conv2d(64, 128, 3, 1)
        self.fc1 = nn.Linear(128*6*6, 256)  # Update the size here
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 20)  # 20 categories for the full dataset

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2, 2)
        x = F.relu(self.conv3(x))
        x = F.max_pool2d(x, 2, 2)
        x = x.view(x.size(0), -1)  # Flatten the tensor
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# Define the categories based on the order from training
categories = ['Blazer', 'Blouse', 'Body', 'Dress', 'Hat', 'Hoodie', 'Longsleeve', 'Not sure', 'Other', 'Outwear',
              'Pants', 'Polo', 'Shirt', 'Shoes', 'Shorts', 'Skip', 'Skirt', 'T-Shirt', 'Top', 'Undershirt']

# Load the trained model
model = ConvolutionalNetwork()
model_path = os.path.join(os.path.dirname(__file__), 'cnn_model.pth')
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

# Define the image transformation
transform = transforms.Compose([
    transforms.Resize((64, 64)),
    transforms.ToTensor(),
])

def predict_image(image_path):
    # Load and preprocess the image
    image = Image.open(image_path).convert('RGB')
    image = transform(image)
    image = image.unsqueeze(0)  # Add batch dimension
    image = image.to(device)  # Move the image tensor to the device (CPU/GPU)

    # Make a prediction
    with torch.no_grad():
        output = model(image)
    _, predicted = torch.max(output.data, 1)

    # Return the predicted category
    predicted_category = categories[predicted.item()]
    return predicted_category

if __name__ == "__main__":
    # Example usage
    image_path = r'C:\Users\corba\Fashion_Project\backend\data\fedora.jpg'  # Update this path to your image
    prediction = predict_image(image_path)
    print(f'The model predicts the category: {prediction}')
