import pandas as pd
import json

df = pd.read_excel("data/ecomix_data.xlsx")
year = 2017
type = "production"
df_y = df[df["Année"] == year]

if type == "production":

# Json for energy production:

    prod_list = list(df_y.iloc[0][4:10].apply(lambda row: {"name": df_y.iloc[0][4:10][df_y.iloc[0][4:10] == row].index[0], "size": float(row)*200+50,"value": float(row), "children":
        list(df_y[["Territoire", df_y.iloc[0][4:10][df_y.iloc[0][4:10] == row].index[0]]].iloc[1:13]
             .apply(lambda row2: {"name": row2["Territoire"],
                                  "size": float(row2[df_y.iloc[0][4:10][df_y.iloc[0][4:10] == row].index[0]])*200+50,
                                  "value": float(row2[df_y.iloc[0][4:10][df_y.iloc[0][4:10] == row].index[0]])}, axis=1))}))

    dic_prod = {"name": "Production totale", "size": float(df_y["Production totale"].iloc[0])*200+50,
                      "value": float(df_y["Production totale"].iloc[0]), "children": prod_list}


    with open(f"graph_production_{year}.json", "w") as write_file:
        json.dump(dic_prod, write_file)

elif type == "consumption":

    # Json for energy consumption

    cons_list = list(df_y.iloc[0][11:20].apply(lambda row: {"name": df_y.iloc[0][11:20][df_y.iloc[0][11:20] == row].index[0], "size": float(row)*200+50,"value": float(row), "children":
        list(df_y[["Territoire", df_y.iloc[0][11:20][df_y.iloc[0][11:20] == row].index[0]]].iloc[1:13]
             .apply(lambda row2: {"name": row2["Territoire"],
                                  "size": float(row2[df_y.iloc[0][11:20][df_y.iloc[0][11:20] == row].index[0]])*200+50,
                                  "value": float(row2[df_y.iloc[0][11:20][df_y.iloc[0][11:20] == row].index[0]])}, axis=1))}))


    dic_cons = {"name": "Consommation totale", "size": float(df_y["Consommation totale"].iloc[0])*200+50,
                      "value": float(df_y["Consommation totale"].iloc[0]), "children": cons_list}

    with open(f"graph_consumption_{year}.json", "w") as write_file:
        json.dump(dic_cons, write_file)






