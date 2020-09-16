import matplotlib
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.ticker import EngFormatter
import os
import json

fig, ax = plt.subplots()

labels_node = []
labels_browser = []
values_list_node = []
values_list_browser = []
with open('./times-node.json') as json_file:
    data = json.load(json_file)
    for key in data:
        labels_node.append(key)
        values_list_node.append(map(lambda x: float(x)*1e-6, data[key]))
with open('./times-browser.json') as json_file:
    data = json.load(json_file)
    for key in data:
        labels_browser.append(key)
        values_list_browser.append(map(lambda x: float(x)*1e-6, data[key]))


ax.set_ylim([-1, 20])

node_boxplot = plt.boxplot(values_list_node,positions=[0.5,1.5,2.5],patch_artist=True)
c1 = "red"
for item in ['boxes', 'whiskers', 'fliers', 'medians', 'caps']:
    plt.setp(node_boxplot[item], color=c1)
plt.setp(node_boxplot["boxes"], facecolor=c1)
plt.setp(node_boxplot["fliers"], markeredgecolor=c1)

c2 = "purple"
browser_boxplot = plt.boxplot(values_list_browser,positions=[1,2,3],patch_artist=True)
for item in ['boxes', 'whiskers', 'fliers', 'medians', 'caps']:
    plt.setp(browser_boxplot[item], color=c2)
plt.setp(browser_boxplot["boxes"], facecolor=c2)
plt.setp(browser_boxplot["fliers"], markeredgecolor=c2)


plt.xticks(np.arange(0.5, len(labels_node)+0.5), labels_node)
plt.xticks(rotation=60)
plt.xlim(0,3.5)
ax.set_ylabel('ms')

from matplotlib.patches import Patch
legend_elements = [
                   Patch(facecolor=c1, edgecolor=c1),
                   Patch(facecolor=c2, edgecolor=c2)]
ax.legend(legend_elements, ['node-js','browser'])

fig.tight_layout()
plt.savefig("./benchmark.svg")
plt.savefig("./benchmark.png")



