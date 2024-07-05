import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

class ConvolutionalNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 6, 3, 1)
        self.conv2 = nn.Conv2d(6, 16, 3, 1)
        self.fc1 = nn.Linear(5*5*16, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 4) # 4 categories: Hats, Tops, Bottoms, Shoes

    def forward(self, x):
        X = F.relu(self.conv1(x))
        X = F.max_pool2d(X, 2, 2)
        X = F.relu(self.conv2(X))
        X = F.max_pool2d(X, 2, 2)
        X = X.view(-1, 16*5*5)
        X = F.relu(self.fc1(X))
        X = F.relu(self.fc2(X))
        X = self.fc3(X)
        return F.log_softmax(X, dim=1)
    
def load_model():
    model = ConvolutionalNetwork()
    model.load_state_dict(torch.load('path_to_your_model.pth'))
    model.eval()
    return model

def predict_category(image_path):
    transform = transforms.Compose([
        transforms.Resize((28, 28)),
        transforms.ToTensor(),
    ])
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)
    model = load_model()
    output = model(image)
    _, predicted = torch.max(output.data, 1)
    categories = ['Hats', 'Tops', 'Bottoms', 'Shoes']
    return categories[predicted.item()]